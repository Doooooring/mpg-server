/**
 * @api {post} /auth/google/login Request Login on google
 * 
 * @apiVersion        1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {
                yVoteToken : string,
                email : string,
                name : string
            }
        }
 */

/**
 * @api {post} /auth/kakao/login Request Login on Kakao
 * 
 * @apiVersion        1.0.0
 * @apiName KakaoLogin
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {
                yVoteToken : string,
                email : string,
                name : string
            }
        }
 */
