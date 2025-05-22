import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import spNavStyles from './spNav.module.scss';
import headerStyles from './header.module.scss';

function SpNav() {
  const [isOpenSpNav, setIsOpenSpNav] = useState(false);

  /* ルート（pathname）が変わったら必ず閉じる */
  const pathname = usePathname();
  useEffect(() => {
    setIsOpenSpNav(false);
  }, [pathname]);

  return (
    <>
      <input
        type="button"
        onClick={() => setIsOpenSpNav((v) => !v)}
        className={spNavStyles.menuButton}
        id="menuButton"
      />
      <label htmlFor="menuButton" className={spNavStyles.menuIcon}>
        <span className={spNavStyles.menuIconParts} />
      </label>

      <nav className={`${spNavStyles.spNav} ${isOpenSpNav && spNavStyles.openedSpNav}`}>
        <ul>
          <li>
            <Link
              href="/posts/latest"
              className={headerStyles.link}
              onClick={() => setIsOpenSpNav(false)}
            >
              新着記事
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default SpNav;
