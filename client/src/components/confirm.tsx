import { Button } from "./button";
import { Spinner } from "./spinner";
import { Modal } from "./modal";

// Confirmation Modal Component
export function Confirm({ title, body, onCancel, onConfirm, loading }: {
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mt-5 text-sm leading-6 text-slate-600">{body}</p>
      <div className="mt-7 flex justify-end gap-3">
        <Button variant="light" onClick={onCancel}>Cancel</Button>
        <Button variant="dark" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner label="Confirming" /> : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
}