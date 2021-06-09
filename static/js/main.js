async function deleteBook(id){
   await fetch('http://localhost:3001/books/'+id, {
        method: 'DELETE'
    })
}