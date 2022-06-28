import styled from "styled-components";

const LayoutWrapper = styled.div`
  display: flex;
  height: 100%;
`

const Layout: React.FC = ({ children }) => {
  return (
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  );
}

export default Layout;