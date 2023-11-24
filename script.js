// Ardian Wahyu Saputra

const STORAGE_KEY = "BOOK_APPS";
const INCOMPLETE_BOOK = "incompleteBookshelfList";
const COMPLETE_BOOK = "completeBookshelfList";
const BOOK_ID = "itemId";
let books = [];

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function composebookObject(title, author, year, isCompleted) {
  return {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isCompleted,
  };
}

function findbook(bookId) {
  for (const book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findbookIndex(bookId) {
  for (let index = 0; index < books.length; index++) {
    if (books[index].id === bookId) return index;
  }
  return -1;
}

function isStorageExist() {
  return typeof Storage !== "undefined";
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) books = data;
  document.dispatchEvent(new Event("ondataloaded"));
}

function createBookDisplay(title, author, year, isComplete) {
  const theTitle = document.createElement("h3");
  theTitle.innerText = title;
  theTitle.classList.add("move");

  const theAuthor = document.createElement("p");
  theAuthor.innerText = author;

  const theYears = document.createElement("p");
  theYears.classList.add("year");
  theYears.innerText = year;

  const bookIsComplete = createCompleteButton();

  const theRemove = createRemoveButton();
  theRemove.innerText = "Hapus Buku";

  const bookAction = document.createElement("div");
  bookAction.classList.add("action");
  if (isComplete) {
    bookIsComplete.innerText = "Belum Selesai";
  } else {
    bookIsComplete.innerText = "Sudah Selesai";
  }

  bookAction.append(bookIsComplete, theRemove);
  const theItem = document.createElement("article");
  theItem.classList.add("book_item");
  theItem.append(theTitle, theAuthor, theYears, bookAction);

  return theItem;
}

function searchBook() {
  const inputSearch = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const moveBook = document.querySelectorAll(".move");

  for (const move of moveBook) {
    const bookTitle = move.innerText.toLowerCase();
    const keywords = inputSearch.split(" ");

    if (keywords.every((keyword) => bookTitle.includes(keyword))) {
      move.parentElement.style.display = "contents";
    } else {
      move.parentElement.style.display = "none";
    }
  }
}

function addBook() {
  const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOK);
  const completeBookshelfList = document.getElementById(COMPLETE_BOOK);

  const inputTheTitle = document.getElementById("inputBookTitle").value;
  const inputTheAuthor = document.getElementById("inputBookAuthor").value;
  const inputTheYear = document.getElementById("inputBookYear").value;
  const inputIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const book = createBookDisplay(
    inputTheTitle,
    inputTheAuthor,
    inputTheYear,
    inputIsComplete
  );
  const bookObject = composebookObject(
    inputTheTitle,
    inputTheAuthor,
    inputTheYear,
    inputIsComplete
  );

  book[BOOK_ID] = bookObject.id;
  books.push(bookObject);

  if (inputIsComplete == false) {
    incompleteBookshelfList.append(book);
  } else {
    completeBookshelfList.append(book);
  }

  updateDataToStorage();
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function createCompleteButton() {
  return createButton("green", function (event) {
    const parent = event.target.parentElement;
    addBookToCompleted(parent.parentElement);
  });
}

function removeBook(bookElement) {
  const bookPosition = findbookIndex(bookElement[BOOK_ID]);
  if (window.confirm("Apakah anda yakin ingin menghapus buku ini?")) {
    books.splice(bookPosition, 1);
    bookElement.remove();
  }
  updateDataToStorage();
}

function createRemoveButton() {
  return createButton("red", function (event) {
    const parent = event.target.parentElement;
    removeBook(parent.parentElement);
  });
}

function addBookToCompleted(bookElement) {
  const Titled = bookElement.querySelector(".book_item > h3").innerText;
  const Authored = bookElement.querySelector(".book_item > p").innerText;
  const Yeared = bookElement.querySelector(".year").innerText;
  const bookIsComplete = bookElement.querySelector(".green").innerText;

  if (bookIsComplete == "Sudah Selesai") {
    const newBook = createBookDisplay(Titled, Authored, Yeared, true);

    const book = findbook(bookElement[BOOK_ID]);
    book.isCompleted = true;
    newBook[BOOK_ID] = book.id;

    const completeBookshelfList = document.getElementById(COMPLETE_BOOK);
    completeBookshelfList.append(newBook);
  } else {
    const newBook = createBookDisplay(Titled, Authored, Yeared, false);

    const book = findbook(bookElement[BOOK_ID]);
    book.isCompleted = false;
    newBook[BOOK_ID] = book.id;

    const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOK);
    incompleteBookshelfList.append(newBook);
  }
  bookElement.remove();

  updateDataToStorage();
}

function refreshDataFromBooks() {
  const listUncompleted = document.getElementById(INCOMPLETE_BOOK);
  const listCompleted = document.getElementById(COMPLETE_BOOK);

  for (const book of books) {
    const newbook = createBookDisplay(
      book.title,
      book.author,
      book.year,
      book.isCompleted
    );
    newbook[BOOK_ID] = book.id;

    if (book.isCompleted == false) {
      listUncompleted.append(newbook);
    } else {
      listCompleted.append(newbook);
    }
  }
}

function changeText() {
  const checkbox = document.getElementById("inputBookIsComplete");
  const textSubmit = document.getElementById("textSubmit");

  if (checkbox.checked == true) {
    textSubmit.innerText = "Sudah selesai dibaca";
  } else {
    textSubmit.innerText = "Belum selesai dibaca";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("inputBook");
  submitBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchBooks = document.getElementById("searchBook");
  searchBooks.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan");
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
});

