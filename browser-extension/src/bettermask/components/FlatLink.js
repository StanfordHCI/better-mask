import styled from 'styled-components';
import {Link} from 'react-router-dom';

const style = `
text-decoration: none;
color: inherit;

&:hover {
  text-decoration: none;
  color: inherit;
}
`;

export const FlatHtmlLink = styled.a`${style}`;

const FlatLink = styled(Link)`${style}`;

export default FlatLink;
