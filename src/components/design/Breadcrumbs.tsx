import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { def } from "../../helpers/common";

interface IBreadcrumb {
  skipLevels?: number; // the endpoint to start from
  titles?: string[];
}

/**
 * A simple to use breadcrumb component
 * @param props see IBreadcrumb
 */
function Breadcrumbs(props: IBreadcrumb) {
  const router = useRouter();
  const skipLevels: number = def<number>(props.skipLevels, 0);
  const titles: string[] = def<string[]>(props.titles, []);

  /**
   * Builds out the breadcrumb links
   */
  function buildCrumbs() {
    // TODO - BUG where trailing / causes extra slash to appear in breadcrumbs
    const crumbs = router.asPath.split("/");
    const breadcrumbs: JSX.Element[] = [];
    let uri = "";

    for (let i: number = 0; i < crumbs.length; i++) {
      const titleIndex: number = i - skipLevels;
      uri += crumbs[i];
      if (i < crumbs.length - 1) {
        uri += "/";
      }

      if (titleIndex < 0) {
        continue;
      }

      let title: string = crumbs[i];
      if (titles.length >= titleIndex) {
        title = titles[titleIndex];
      }

      breadcrumbs.push(
        <Link href={uri} passHref>
          <MuiLink color="inherit">{title}</MuiLink>
        </Link>,
      );
    }

    return breadcrumbs;
  }

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      { buildCrumbs() }
    </MuiBreadcrumbs>
  );
}

export default Breadcrumbs;