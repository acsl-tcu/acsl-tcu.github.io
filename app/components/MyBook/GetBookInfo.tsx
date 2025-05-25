export interface BookInfo {
  isbn: string;
  title?: string;
  author?: string;
  publisher?: string;
  pubdate?: string;
  overview?: string;
  created_at?: Date;
}

export interface BookResult {
  book: BookInfo;
  image?: string;
}

async function GetBookInfo(isbn: string): Promise<BookResult> {
  const openbdUrl = `https://api.openbd.jp/v1/get?isbn=${isbn}`;
  const rakutenUrl = `https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=1048773641258178320&isbnjan=${isbn.replace(/-/g, '')}`;
  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.replace(/-/g, '')}`;

  let openbdData: BookInfo = { isbn };

  try {
    const res = await fetch(openbdUrl);
    const json: any[] = await res.json();
    if (json[0]) {
      openbdData = {
        isbn,
        author: json[0].summary?.author,
        title: json[0].summary?.title,
        publisher: json[0].summary?.publisher,
        pubdate: json[0].summary?.pubdate,
        created_at: new Date()
      };
    }
  } catch (error) {
    console.error('OpenBD API error:', error);
  }

  let rakutenBook = openbdData;
  let rakutenImage: string | undefined;

  try {
    const res = await fetch(rakutenUrl);
    const json = await res.json();
    if (json.Items?.length > 0) {
      const item = json.Items[0].Item;
      rakutenBook = {
        ...rakutenBook,
        title: item.title,
        author: item.author,
        publisher: item.publisherName,
        pubdate: item.salesDate,
        overview: item.itemCaption
      };
      rakutenImage = item.largeImageUrl;
    }
  } catch (error) {
    console.error('Rakuten API error:', error);
  }

  let googleBook = rakutenBook;
  let googleImage = rakutenImage;

  try {
    const res = await fetch(googleBooksUrl);
    const json = await res.json();
    if (json.totalItems && json.items?.[0]) {
      const volume = json.items[0].volumeInfo;
      if (volume.imageLinks?.thumbnail) {
        googleImage = volume.imageLinks.thumbnail;
      }
      googleBook = {
        ...googleBook,
        title: volume.title ?? googleBook.title,
        author: volume.authors?.join(', ') ?? googleBook.author,
        publisher: volume.publisher ?? googleBook.publisher,
        pubdate: volume.publishedDate ?? googleBook.pubdate,
        overview: volume.description ?? googleBook.overview,
      };
    }
  } catch (error) {
    console.error('Google Books API error:', error);
  }

  return { book: googleBook, image: googleImage };
}

export default GetBookInfo;
