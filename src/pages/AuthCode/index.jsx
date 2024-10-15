import Button from '@/components/Button';
import Input from '@/components/Input';
import { useState } from '@/library/hooks';
import { useNavigate } from '@/library/router/hooks';
import { postCode } from '@/services/auth';

const AuthCode = () => {
  const [code, setCode] = useState('');
  const isValidCode = validateCode(code);
  const navigate = useNavigate();
  const handldeClick = () => {
    if (!code) {
      return alert('인증 코드를 입력해주세요');
    }
    if (!isValidCode) {
      return alert('인증 코드는 6자리 숫자로 입력해주세요');
    }
    postCode(code).then(() => {
      navigate('/lobby', { replace: true });
    });
  };

  return (
    <div
      className='card top-50 start-50 translate-middle d-flex flex-column'
      style='width: 540px;'
    >
      <h1>인증 코드 입력</h1>
      <p>
        이메일로 전송된 6자리 인증 코드를 입력 후 [인증 활성화] 버튼을
        클릭해주세요
      </p>
      <div className='my-4'>
        <Input
          placeholder='인증 코드를를 입력해주세요'
          type='password'
          label='Verification Code'
          onChange={(e) => setCode(e.target.value)}
        />
        {!isValidCode && (
          <span className='form-text text-danger'>
            인증 코드 형식이 올바르지 않습니다
          </span>
        )}
      </div>
      <Button onClick={handldeClick}>인증 활성화</Button>
    </div>
  );
};

const validateCode = (code) => {
  return !code || /^[0-9]{6}$/.test(code);
};

export default AuthCode;
