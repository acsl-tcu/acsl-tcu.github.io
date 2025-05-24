async function GetBookInfo(isbn: string): Promise<{ book: Record<string, any>, image?: string }> {
  const openbdUrl = `https://api.openbd.jp/v1/get?isbn=${isbn}`;
  const rakutenUrl = `https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=1048773641258178320&isbnjan=${isbn.replace(/-/g, '')}`;
  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.replace(/-/g, '')}`;

  let openbdData: Record<string, any> = { isbn };

  try {
    const res = await fetch(openbdUrl);
    const json = await res.json();
    if (json[0]) {
      openbdData = {
        isbn,
        author: json[0].summary.author,
        title: json[0].summary.title,
        publisher: json[0].summary.publisher,
        pubdate: json[0].summary.pubdate,
        created_at: new Date()
      };
    }
  } catch (error) {
    console.error('OpenBD API error:', error);
  }

  let rakutenBook = openbdData;
  let rakutenImage: string | undefined = undefined;

  try {
    const res = await fetch(rakutenUrl);
    const json = await res.json();
    if (json.Items.length > 0) {
      rakutenBook = MergeObject(openbdData, {
        title: json.Items[0].Item.title,
        author: json.Items[0].Item.author,
        publisher: json.Items[0].Item.publisherName,
        pubdate: json.Items[0].Item.salesDate,
        overview: json.Items[0].Item.itemCaption
      });
      rakutenImage = json.Items[0].largeImageUrl;
    }
  } catch (error) {
    console.error('Rakuten API error:', error);
  }

  let googleBook = rakutenBook;
  let googleImage = rakutenImage;

  try {
    const res = await fetch(googleBooksUrl);
    const json = await res.json();
    if (json.totalItems && json.items[0]) {
      const volume = json.items[0].volumeInfo;
      if (volume.imageLinks) {
        googleImage = volume.imageLinks.thumbnail;
      }
      googleBook = MergeObject(rakutenBook, {
        title: volume.title,
        author: volume.authors?.join(', '),
        publisher: volume.publisher,
        pubdate: volume.publishedDate,
        overview: volume.description
      });
    }
  } catch (error) {
    console.error('Google Books API error:', error);
  }

  return { book: googleBook, image: googleImage };
}

function MergeObject(o1: Record<string, any>, o2: Record<string, any>): Record<string, any> {
  return { ...o1, ...o2 };
}

export default GetBookInfo;
