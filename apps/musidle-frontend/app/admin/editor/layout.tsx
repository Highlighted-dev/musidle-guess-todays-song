interface IEditorProps {
  children?: React.ReactNode;
}

export default function EditorLayout({ children }: IEditorProps) {
  return <div className="container mx-auto grid items-start gap-10 ">{children}</div>;
}
