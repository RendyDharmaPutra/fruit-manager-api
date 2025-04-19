// Mode Response Error
type FailedResponseType<T> = RawResponseType & {
  success: false;
  error: T;
};
