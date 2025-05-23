import { DateStoreProvider } from "./store";

export default function DatePickerParent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DateStoreProvider>{children}</DateStoreProvider>;
}
