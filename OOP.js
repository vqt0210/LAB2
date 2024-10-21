// Book Class
class Book {
  constructor(title, author, isbn, availableCopies) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.availableCopies = availableCopies;
  }

  // Method to borrow a book
  borrowBook() {
    if (this.availableCopies > 0) {
      this.availableCopies -= 1;
    } else {
      throw new Error(`${this.title} is currently unavailable.`);
    }
  }

  // Method to return a book
  returnBook() {
    this.availableCopies += 1;
  }
}

// Abstract User Class
class User {
  constructor(name, userType) {
    if (new.target === User) {
      throw new Error("Cannot instantiate abstract class User directly.");
    }
    this.name = name;
    this.userType = userType;
    this.borrowedBooks = [];
  }

  // Abstract method for borrowing a book (to be implemented by child classes)
  borrow(book) {
    throw new Error("This method must be implemented by subclass.");
  }

  return(book) {
    const bookIndex = this.borrowedBooks.findIndex(b => b.isbn === book.isbn);
    if (bookIndex > -1) {
      this.borrowedBooks.splice(bookIndex, 1);
      book.returnBook();
    } else {
      throw new Error(`${this.name} has not borrowed ${book.title}.`);
    }
  }
}

// Student Class (inherits from User)
class Student extends User {
  constructor(name) {
    super(name, 'Student');
  }

  // Borrow method that checks student borrow limit (3 books)
  borrow(book) {
    if (this.borrowedBooks.length >= 3) {
      throw new Error("Students can only borrow up to 3 books.");
    }
    if (book.availableCopies === 0) {
      throw new Error(`${book.title} is unavailable.`);
    }
    this.borrowedBooks.push(book);
    book.borrowBook();
  }
}

// Teacher Class (inherits from User)
class Teacher extends User {
  constructor(name) {
    super(name, 'Teacher');
  }

  // Borrow method that checks teacher borrow limit (5 books)
  borrow(book) {
    if (this.borrowedBooks.length >= 5) {
      throw new Error("Teachers can only borrow up to 5 books.");
    }
    if (book.availableCopies === 0) {
      throw new Error(`${book.title} is unavailable.`);
    }
    this.borrowedBooks.push(book);
    book.borrowBook();
  }
}

// Library Class
class Library {
  constructor() {
    this.books = [];
    this.users = [];
  }

  // Add a book to the library
  addBook(book) {
    this.books.push(book);
  }

  // Add a user to the system
  addUser(user) {
    this.users.push(user);
  }

  // Handle the borrowing process
  borrowBook(user, bookTitle) {
    const book = this.books.find(b => b.title === bookTitle);
    if (!book) {
      throw new Error(`${bookTitle} is not available in the library.`);
    }
    user.borrow(book);
  }

  // Handle the returning process
  returnBook(user, bookTitle) {
    const book = this.books.find(b => b.title === bookTitle);
    if (!book) {
      throw new Error(`${bookTitle} is not a valid book in the library.`);
    }
    user.return(book);
  }

  // List all available books in the library
  listAvailableBooks() {
    return this.books.filter(book => book.availableCopies > 0);
  }
}

try {
  // Create library
  const library = new Library();

  // Add books to library
  const book1 = new Book('1984', 'George Orwell', '123456789', 5);
  const book2 = new Book('To Kill a Mockingbird', 'Harper Lee', '987654321', 2);
  const book3 = new Book('The Great Gatsby', 'F. Scott Fitzgerald', '111111111', 0); // Unavailable
  library.addBook(book1);
  library.addBook(book2);
  library.addBook(book3);

  // Add users
  const student = new Student('Alice');
  const teacher = new Teacher('Mr. Smith');
  library.addUser(student);
  library.addUser(teacher);

  // Borrow books
  library.borrowBook(student, '1984'); // Success
  library.borrowBook(teacher, 'To Kill a Mockingbird'); // Success

  // Student trying to borrow unavailable book
  try {
    library.borrowBook(student, 'The Great Gatsby');
  } catch (error) {
    console.error(error.message); // "The Great Gatsby is unavailable."
  }

  
  library.borrowBook(teacher, '1984'); 
  library.borrowBook(teacher, 'To Kill a Mockingbird'); 

  // Return books
  library.returnBook(teacher, 'To Kill a Mockingbird'); 

  // List available books
  console.log('Available books:', library.listAvailableBooks());
} catch (error) {
  console.error(error.message);
}
