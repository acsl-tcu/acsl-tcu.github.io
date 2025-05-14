import { redirect } from 'next/navigation';
// Redirect /lang or /lang/ to /lang/Home
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/Home`);
}
