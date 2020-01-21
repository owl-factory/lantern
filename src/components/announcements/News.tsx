import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";

function News(props: any) {
  const news: JSX.Element[] = [];

  props.articles.forEach((article: any) => {
    news.push(<ArticleCard article={article}/>);
  });

  return <div>{news}</div>;
}

function ArticleCard(props: any) {
  const contents: JSX.Element[] = [];

  props.article.content.forEach((line: string) => {
    contents.push(<Typography variant="body2">{line}</Typography>);
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{props.article.title}</Typography>
        <Typography color="textSecondary" gutterBottom>
          Posted at {props.article.postedAt} by {props.article.author}
        </Typography>
        {contents}
      </CardContent>
    </Card>
  );
}

export default News;
