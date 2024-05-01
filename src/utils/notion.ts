import { Client, isFullPage } from "@notionhq/client"
import { GetBlockResponse, ListBlockChildrenResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

export const getBlockChildren = async (
  notionClient: Client,
  block_id: string,
  totalPage: number | null
) => {
  try {
    let results: GetBlockResponse[] = [];
    let pageCount = 0;
    let start_cursor = undefined;

    do {
      const response: ListBlockChildrenResponse = await notionClient.blocks.children.list({
        start_cursor,
        block_id
      })
      results.push(...response.results);

      start_cursor = response.next_cursor;
      pageCount += 1;
    } while (
      start_cursor != null &&
      (totalPage == null || pageCount < totalPage)
    );

    return results;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export function getPageTitle(page: PageObjectResponse): string {
  const title = page.properties.Name ?? page.properties.title;
  if (title.type === "title") {
    return title.title.map((text) => text.plain_text).join("");
  }
  throw Error(
    `page.properties.Name has type ${title.type} instead of title. The underlying Notion API might has changed, please report an issue to the author.`
  );
}

export function getFileName(title: any, page_id: any): string {
  return title.replaceAll(" ", "-").replace(/--+/g, "-") +
  "-" +
  page_id.replaceAll("-", "") + '.md';
}

export const getPageLinkFromId = async(pageId: string, notion: Client) => {
  const dstPage = await (notion.pages.retrieve({ page_id: pageId }))
  if (isFullPage(dstPage)){
    const dst_file = getFileName(getPageTitle(dstPage), dstPage.id)
    const dst_link = `{{< relref "${dst_file}" >}}`
    return {title: getPageTitle(dstPage), link: dst_link}
  }
  return null
}

