/**
 * @api {get} /news/:id Request News Details
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsDetailById
 * @apiGroup 1.News
 *
 * @apiParam {string} id News id
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
          success : boolean, 
          result : {
            news : {
              _id: Types.ObjectId;
              order: number;
              title: string;
              summary: string;
              news: Array<{ date: Date; title: string; link: string }>;
              journals: Array<{ press: string; title: string; link: string }>;
              keywords: Array<string>;
              state: Boolean;
              opinions: {
                left: string;
                right: string;
              };
              comments: Array<comment>;
              votes: {
                left: number;
                right: number;
                none: number;
              };
            }
          }
        }
 */

/**
 * @api {get} /news/:id/comment Request News Comments
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsCommentsById
 * @apiGroup 1.News
 * 
 * @apiParam {string} id News id
 *
 * @apiQuery {string} type News Comment Type (ex : 지도자, 예술가, 감시자 )
 * @apiQuery {number} page News Comments Page
 * @apiQuery {number} limit News Comments Limit
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
          "success": true,
          "result": {
            comments: Array<{
              title: string;
              comment: string;
            }>;
          }
        }
 */

/**
 * @api {get} /news/preview Request News Preivews
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsPreviewList
 * @apiGroup 1.News
 *
 * @apiQuery {number} page News Preview Offset
 * @apiQuery {number} limit News Preview Limit
 * @apiQuery {string} keyword News Preview keyword filter
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
         "success": true,
         "result": {
         "news": [
                    {
                      "_id": "string",
                      "order": "number",
                      "title": "string",
                      "summary": "string",
                      "keywords": ["string"],
                      "state": "boolean"
                  
                    }
                ]
            }
        }
 */
