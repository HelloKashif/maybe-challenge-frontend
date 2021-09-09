import { NextApiRequest, NextApiResponse } from "next";
import searchIndex from "../../data/searchIndex.json";
import elasticlunr from "elasticlunr";

const MIN_SCORE = 0.5;
const MAX_RESULTS = 20;
const SEARCH_CONFIG = { expand: true };

const index = elasticlunr.Index.load(searchIndex);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { q } = req.query;

  //EdgeCase: We fail on empty query
  //Technically we could return a few by default
  //but that wouldn't be very useful list for users
  if (!q || q === "") {
    res
      .status(400)
      .json({ error: "Missing query param 'q'. Eg. /api/search?q=Germany" });
    return;
  }

  const result = [];
  index.search(q, SEARCH_CONFIG).forEach(({ ref, score }) => {
    //EdgeCase: Prevent matching very generic words
    //like Air for performance.
    //Algolia/Elasticsearch have more performant way
    //of doing these kinds of filtering
    if (score < MIN_SCORE) {
      return;
    }

    //EdgeCase: Paginate/Limit (Very basic)
    //We do it here since elasticlunar doesn't have built
    //pagination. If we were to use Algolia/Elasticsearch
    //we wouldn't be doing it here.
    if (result.length >= MAX_RESULTS) {
      return;
    }

    result.push(index.documentStore.getDoc(ref));
  });
  res.status(200).json(result);
};

/*
 
 EdgeCases:
  - Empty query
      - Do we return ALL items or error?
  - Pagination/Limit? 
      - Should large query be paginated?
  - Some queries can potentially return large datasets
      Eg. Ai (Almost everyone will have 'Airport' in it)

 */
