/**
 * @api {get} /news/:id Request News Details
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsDetailById
 * @apiGroup News
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
 * @apiGroup News
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
 * @api {get} /news/:id/result Request News Comments
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsCommentsById
 * @apiGroup News
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
 * @api {get} /news/:id/vote Request News Vote Result
 *
 * @apiVersion        1.0.0
 * @apiName PostNewsUserVote
 * @apiGroup News
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiParam {String} id News id
 * @apiSuccessExample Success-Response:
        HTTP/1.1 200 OK
        {
          "success": true,
          "result": {
            left : number,
            right : number,
            none : number
          }
        }
 * 
 * @apiError (401 NoAuthorization) AuthorizationTokenNeeded
 * @apiErrorExample {json} Error-Response:
       HTTP/1.1 401 Unauthorized
 *     {
 *       "success" : false,
 *       "result" : {
 *          "error" : "The authorization token is needed"   
 *      }
 *     }
 * 
 * @apiError (500 ServerError) ServerError 
 * @apiErrorExample {json} Error-Response:
       HTTP/1.1 500 Unauthorized
 *     {
 *       "success" : false,
 *       "result" : {
 *          "error" : 'error message"   
 *      }
 *     }
 */

/**
 * @api {post} /news/:id/vote Request User Vote News
 *
 * @apiVersion        1.0.0
 * @apiName GetNewsVote
 * @apiGroup News
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiParam {String} id News id
 *
 * @apiBody {string='left','right','none'} response User vote response "left" | "right" | "none"
 * @apiBody {number=1,-1} result Vote or cancel. Case 1 Vote : result = 1, Case 2 Cancel : result = - 1
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
          "success": true,
          "result": {
            left : number,
            right : number,
            none : number
          }
        }
 */

/**
 * @api {get} /news/preview Request News Preivews
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsPreviewList
 * @apiGroup News
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
