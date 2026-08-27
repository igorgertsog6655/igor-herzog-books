import type { Metadata } from 'next';

const assetRoot = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Игорь ГЕРЦОГ — полный портрет',
  description: 'Полный авторский портрет Игоря Герцога.',
};

export default function PortraitPage() {
  return (
    <main className="fullPortraitPage">
      <a className="portraitBack" href={`${assetRoot}/#author`}>← Вернуться на сайт · Back to site</a>
      <img src={`${assetRoot}/author/igor-herzog-6-oil-full.png`} alt="Игорь ГЕРЦОГ — полный портрет" />
    </main>
  );
}
