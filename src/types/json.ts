export type Json = {
  [key: string]: Json | string | number | boolean | null | Json[] | { [key: string]: Json | undefined };
}
