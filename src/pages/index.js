import React from 'react';
import {
  graphql, useStaticQuery, Link,
} from 'gatsby';

function IndexPage() {
  const data = useStaticQuery(graphql`
    query {
      allSitePage(
        filter: {path: {nin: ["/", "/404.html", "/404.html", "/404/", "/dev-404-page/"]}},
        sort: {fields: path, order: ASC}) {
        edges {
          node {
            path
          }
        }
      }
    }
  `);

  const { allSitePage } = data;

  const allSitePages = allSitePage.edges.filter((edge) => edge.node.path !== '/future-building-materials');

  return (
    <div className="links-container">
      <h1>Flipbooks</h1>
      <ul>
        {allSitePages.map(({ node }) => (
          <li key={node.path}>
            <Link to={node.path} key={node.path}>
              {node.path}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IndexPage;
