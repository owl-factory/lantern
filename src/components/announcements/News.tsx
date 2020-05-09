import { Row, Card } from "react-bootstrap";
import React from "react";
import { FullWrapper } from "../common/wrappers";

function News(props: any) {
  const news: JSX.Element[] = [];

  props.articles.forEach((article: any) => {
    news.push(<ArticleCard key={article.id} article={article} />);
  });

  return <Row>{news}</Row>;
}

function ArticleCard(props: any) {
  const contents: JSX.Element[] = [];
  let contentKey: number = 0;

  props.article.content.forEach((line: string) => {
    contents.push(<p key={contentKey++}>{line}</p>);
  });

  return (
    <FullWrapper>
      <h5>{props.article.title}</h5>
      <p>
        Posted at {props.article.postedAt} by {props.article.author}
      </p>
      {contents}
    </FullWrapper>
  );
}

export default News;
