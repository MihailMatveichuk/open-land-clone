import logoSrc from '../../../public/assets/images/logo.png';
import Link from 'next/link';
import Image from 'next/image';

const OnBoarding = () => {
  return (
    <div className="on-boarding">
      <div className="on-boarding__inner">
        <div className="on-boarding__top"></div>
        <div className="on-boarding__step">
          <Image className="on-boarding__logo" src={logoSrc} alt="logo" />
          <h1 className="on-boarding__title title">Openland</h1>
          <div className="on-boarding__text text">
            Modern social network built for you, not advertisers
          </div>
          <div className="on-boarding__btn-container">
            <Link href={'/auth/phone'} className="btn btn--primary">
              Continue with phone
            </Link>
            <Link href={'/auth/email'} className="btn btn--grey">
              Continue with email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
