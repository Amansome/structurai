import { redirect } from 'next/navigation';

export default function PasswordRedirect() {
  redirect('/password/reset');
}