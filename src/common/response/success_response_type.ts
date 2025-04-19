// Model Response Sukses
type SuccessResponseType<T> = RawResponseType & {
  success: true;
  data: T extends any[] ? ResponseData<T[number]> : T;
  // Jika Generic yang diterima berbentuk Array, maka data adalah ResponseData dengan generic yang diterima. Jika bukan, maka mengirim generic yang diterima langsung
};
