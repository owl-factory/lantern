import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { FullWrapper } from "../common/wrappers";

function News(props: any) {
  const news: JSX.Element[] = [];

  props.articles.forEach((article: any) => {
    news.push(<ArticleCard key={article.id} article={article}/>);
  });

  return <Grid container>{news}</Grid>;
}

function ArticleCard(props: any) {
  const contents: JSX.Element[] = [];
  let contentKey: number = 0;

  props.article.content.forEach((line: string) => {
    contents.push(<Typography key={contentKey++} variant="body2">{line}</Typography>);
  });

  return (
    <FullWrapper>
      <Typography variant="h5">{props.article.title}</Typography>
      <Typography color="textSecondary" gutterBottom>
        Posted at {props.article.postedAt} by {props.article.author}
      </Typography>
      {contents}
    </FullWrapper>
  );
}

export default News;
