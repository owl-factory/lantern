import React from "react";
import { Row, Card, Col } from "react-bootstrap";

/**
 * This is a conceptual article system built early on for creating mock ups. 
 * It is likely to be changed considerably in the future.
 */

interface ArticleItem {
  id: number; // The id of the article item
  title: string; // The title of the article
  content: string[]; // The content of the article divided into paragraphs
  postedAt: string; // The date this was posted at
  author: string; // The author of this article
}

// Props used for the News component
interface NewsProps {
  articles: ArticleItem[];
}

interface ArticleCardProps extends ArticleItem {
  key: string;
}

/**
 * Renders a collection of news articles
 * @param props.articles An array of article items to render out
 */
function News(props: NewsProps) {
  const news: JSX.Element[] = [];

  props.articles.forEach((article: ArticleItem) => {
    news.push(<ArticleCard key={"article_" + article.id} {...article} />);
  });

  return <Row>{news}</Row>;
}

/**
 * Renders a single article
 * @param props.title The title of the article
 * @param props.content An array of strings for each paragraph
 * @param props.postedAt The date this was posted at
 * @param props.author The author of this article
 */
function ArticleCard(props: ArticleCardProps) {
  const contents: JSX.Element[] = [];
  let contentKey: number = 0;

  props.content.forEach((line: string) => {
    contents.push(<p key={contentKey++}>{line}</p>);
  });

  return (
    <Col md="12">
      <Card className="mb-2 mt-2">
        <Card.Body>
          <h5>{props.title}</h5>
          <p>
            Posted at {props.postedAt} by {props.author}
          </p>
          {contents}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default News;
