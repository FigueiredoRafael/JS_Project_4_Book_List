// Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {
  UI.prototype.addBookToList = function (book) {
    const list = document.getElementById("book-list");
    // Create tr element
    const row = document.createElement("tr");
    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class='delete' id='x'>X</a></td>`;
  
    list.appendChild(row);
  };
  
  // Show Alert
  UI.prototype.showAlert = function (message, className) {
    //Create Div
    const div = document.createElement("div");
    //Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector(".container");
    // Get form
    const form = document.querySelector("#book-form");
    // Insert alert
    container.insertBefore(div, form);
  
    // Timeout after 3 sec
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  };
  
  // Delete Book
  UI.prototype.deleteBook = function (target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  };
  
  // Clear Fields
  UI.prototype.clearFields = function () {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  };
}

// // Local Storage Class
function Store(){
  UI.prototype.getBooks = function(){
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else{
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  UI.prototype.displayBooks = function(){
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui = new UI;

      // Add book to UI
      ui.addBookToList(book);
    });

  }
  
  UI.prototype.addBook = function(book){
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  UI.prototype.removeBook = function(isbn, index){
    const books = Store.getBooks();
    books.forEach(function(book){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));

  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks)

// Event listeners for add Book
document.getElementById("book-form").addEventListener("submit", function (e) {
  // Get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (title === "" || author === "" || isbn === "") {
    //Error alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to LS 
    Store.ui.addBook(book);    

    // Show success
    ui.showAlert("Book added!", "success");

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  const ui = new UI();
  if (e.target) {
    ui.deleteBook(e.target);

    //Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);    

    // Show message
    ui.showAlert("Book Removed", "success");
  } else {
    console.log("test");
  }

  e.preventDefault();
});
