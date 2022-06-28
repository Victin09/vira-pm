import styled from "styled-components";

type ButtonProps = {
  children: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-top: 1em;
  background-color: #504E8F;
  color: #FFFFFF;
  width: 100%;
  padding-top: .5em;
  padding-bottom: .5em;
  padding-left: 1em;
  padding-right: 1em;
`

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <ButtonWrapper {...props}>{children}</ButtonWrapper>
  );
}

export default Button;