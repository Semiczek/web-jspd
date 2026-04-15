import {Dictionary} from './types';

export default function SiteFooter({dict}: {dict: Dictionary}) {
  return (
    <footer className="site-footer">
      <div className="container footer-box">
        <div>
          <strong>{dict.common.footerLeft}</strong>
          <p>{dict.common.footerNote}</p>
        </div>
        <div>{dict.common.footerRight}</div>
      </div>
    </footer>
  );
}
