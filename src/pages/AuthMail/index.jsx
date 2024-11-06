import Button from '@/components/Button';
import Input from '@/components/Input';
import { useState } from '@/library/hooks.js';
import { useNavigate } from '@/library/router/hooks.js';
import { postEmail } from '@/services/auth.js';

const AuthMail = () => {
  const [email, setEmail] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const isValidEmail = validateEmail(email);
  const navigate = useNavigate();
  const handldeClick = () => {
    if (!email) {
      return alert('이메일을 입력해주세요');
    }
    if (!isValidEmail) {
      return alert('이메일을 형식에 맞게 입력해주세요');
    }
    postEmail(email).then(() => {
      navigate('/auth/code', { replace: true });
    });
    setButtonDisabled(true);
  };

  return (
    <div
      className='card top-50 start-50 translate-middle d-flex flex-column'
      style='width: 540px;'
    >
      <h1>메일 인증</h1>
      <p>인증 코드를 받을 이메일을 입력해주세요</p>
      <div className='my-4'>
        <Input
          placeholder='이메일을 입력해주세요'
          type='email'
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isValidEmail && (
          <span className='form-text text-danger'>
            이메일 형식이 올바르지 않습니다
          </span>
        )}
      </div>
      <Button onClick={handldeClick} disabled={buttonDisabled}>
        다음
      </Button>
    </div>
  );
};

const validateEmail = (email) => {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default AuthMail;
