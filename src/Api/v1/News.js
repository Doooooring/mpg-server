/** 
 * @api / Interface
 * @apiVersion        1.0.0
 * @apiName NewsInterface
 * @apiGroup News
 *
 * @apiSuccessExample News Interface
 *   {
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
      comments: Array<Comment>;
    }

    enum Comment {
      전략가,
      지도자,
      예술가,
      감시자,
      운영자,
      공화주의자,
      관찰자,
      개혁가,
      이론가,
      자유주의자,
      민주당,
      국민의힘,
      청와대,
      헌법재판소,
      와이보트,
      기타,
    }
 */

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
              comments: Array<Comment>;
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
 * @apiBody {string='left','right','none'} response User vote response "left" | "right" | "none" | null (left : 반대에요, right : 찬성이에요, none : 잘 모르겠어요, null : 응답없음)
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
