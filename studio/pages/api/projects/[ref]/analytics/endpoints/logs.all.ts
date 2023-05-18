import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGetAll(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const {iso_timestamp_start, iso_timestamp_end, sql} = req.query
  const response = {
    "result": [
      {
        "event_message": "GET | 200 | 167.88.158.73 | 7c8a0ab9ce0391ba | https://ayszhkmxtffgssgwicyy.supabase.co/rest-admin/v1/live | node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
        "metadata": [
          {
            "logflare_worker": [
              {
                "worker_id": "X4W56V"
              }
            ],
            "request": [
              {
                "cf": [
                  {
                    "asOrganization": "CacheNetworks",
                    "asn": 30081,
                    "botManagement": [
                      {
                        "corporateProxy": false,
                        "detectionIds": [
                          33554454,
                          33554652
                        ],
                        "ja3Hash": "398430069e0a8ecfbc8db0778d658d77",
                        "jsDetection": [],
                        "score": 1,
                        "staticResource": false,
                        "verifiedBot": false
                      }
                    ],
                    "city": null,
                    "clientAcceptEncoding": "gzip,deflate",
                    "clientTcpRtt": 1,
                    "clientTrustScore": 1,
                    "colo": "SIN",
                    "continent": "AS",
                    "country": "SG",
                    "edgeRequestKeepAliveStatus": 1,
                    "httpProtocol": "HTTP/1.1",
                    "isEUCountry": null,
                    "latitude": "1.36730",
                    "longitude": "103.80140",
                    "metroCode": null,
                    "postalCode": null,
                    "region": null,
                    "regionCode": null,
                    "requestPriority": null,
                    "timezone": "Asia/Singapore",
                    "tlsCipher": "AEAD-AES256-GCM-SHA384",
                    "tlsClientAuth": [
                      {
                        "certPresented": "0",
                        "certRevoked": "0",
                        "certVerified": "NONE"
                      }
                    ],
                    "tlsExportedAuthenticator": [
                      {
                        "clientFinished": "dc7f7a2572cec3c1ee2f65d65c2a4bae31bcf49f83df761da1a8b25ccc1b78287e44a75f041066b9dc9e47f75da04eb2",
                        "clientHandshake": "e1b24051a3ecb026417ed689e0768196cbea5cf2e509200bdd7459efb12266c20bf27663ed1ca4228ff3ddb6b2cf7107",
                        "serverFinished": "2a0308b83c91a539e4683f6b23a1e3116c0c7083074d57d5dcf01db5c96c38b42e1cdf44d712afdf016665879d97aac1",
                        "serverHandshake": "a46a0552ba8174ae394eb1ec37fd49f966c3ac579f4f73be10e71f82ad19b825cb5298599a66e4a9a29cc9e336e94f0d"
                      }
                    ],
                    "tlsVersion": "TLSv1.3"
                  }
                ],
                "headers": [
                  {
                    "accept": "*/*",
                    "cf_cache_status": null,
                    "cf_connecting_ip": "167.88.158.73",
                    "cf_ipcountry": "SG",
                    "cf_ray": "7c8a0ab9ce0391ba",
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": null,
                    "date": null,
                    "host": "ayszhkmxtffgssgwicyy.supabase.co",
                    "referer": null,
                    "sb_gateway_version": null,
                    "user_agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
                    "x_client_info": null,
                    "x_forwarded_proto": "https",
                    "x_forwarded_user_agent": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null,
                    "x_real_ip": "167.88.158.73"
                  }
                ],
                "host": "ayszhkmxtffgssgwicyy.supabase.co",
                "method": "GET",
                "path": "/rest-admin/v1/live",
                "port": null,
                "protocol": "https:",
                "sb": [],
                "search": null,
                "url": "https://ayszhkmxtffgssgwicyy.supabase.co/rest-admin/v1/live"
              }
            ],
            "response": [
              {
                "headers": [
                  {
                    "cf_cache_status": "DYNAMIC",
                    "cf_ray": "7c8a0abb10e191ba-SIN",
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": null,
                    "date": "Wed, 17 May 2023 07:10:40 GMT",
                    "sb_gateway_mode": null,
                    "sb_gateway_version": "1",
                    "transfer_encoding": "chunked",
                    "x_kong_proxy_latency": "1",
                    "x_kong_upstream_latency": "4"
                  }
                ],
                "origin_time": 1001,
                "status_code": 200
              }
            ]
          }
        ],
        "timestamp": "2023-05-17T07:10:40.652000"
      },
      {
        "event_message": "GET | 401 | 87.236.176.247 | 7c89b11e5f411c1a | https://ayszhkmxtffgssgwicyy.supabase.co/ | Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)",
        "metadata": [
          {
            "logflare_worker": [
              {
                "worker_id": "JKJ01Z"
              }
            ],
            "request": [
              {
                "cf": [
                  {
                    "asOrganization": "Constantine Cybersecurity Ltd.",
                    "asn": 211298,
                    "botManagement": [
                      {
                        "corporateProxy": false,
                        "detectionIds": [],
                        "ja3Hash": "7c16ad76eea772e6277cbb0a49d73a5f",
                        "jsDetection": [],
                        "score": 3,
                        "staticResource": false,
                        "verifiedBot": false
                      }
                    ],
                    "city": null,
                    "clientAcceptEncoding": "gzip",
                    "clientTcpRtt": 13,
                    "clientTrustScore": 3,
                    "colo": "AMS",
                    "continent": "EU",
                    "country": "GB",
                    "edgeRequestKeepAliveStatus": 1,
                    "httpProtocol": "HTTP/1.1",
                    "isEUCountry": null,
                    "latitude": "51.49640",
                    "longitude": "-0.12240",
                    "metroCode": null,
                    "postalCode": null,
                    "region": null,
                    "regionCode": null,
                    "requestPriority": null,
                    "timezone": "Europe/London",
                    "tlsCipher": "AEAD-AES128-GCM-SHA256",
                    "tlsClientAuth": [
                      {
                        "certPresented": "0",
                        "certRevoked": "0",
                        "certVerified": "NONE"
                      }
                    ],
                    "tlsExportedAuthenticator": [
                      {
                        "clientFinished": "05f78dee1ebf65844525286dfc16f324a9c358598fbbd8854f6e1a98ee8549a0",
                        "clientHandshake": "8f8de025c753ea35898beb80c9cca2167f2e3fd21487340a895687a20c86d3b8",
                        "serverFinished": "28ab0d77fbe2f8819d2c351a38d265ddd2bfa41c09d85a81d635db0eb4fd8e42",
                        "serverHandshake": "4487f7d92beff6f8d07ef4d4dd354111263ec21660bdab7f3d75dac22a6e4ad8"
                      }
                    ],
                    "tlsVersion": "TLSv1.3"
                  }
                ],
                "headers": [
                  {
                    "accept": "*/*",
                    "cf_cache_status": null,
                    "cf_connecting_ip": "87.236.176.247",
                    "cf_ipcountry": "GB",
                    "cf_ray": "7c89b11e5f411c1a",
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": null,
                    "date": null,
                    "host": "ayszhkmxtffgssgwicyy.supabase.co",
                    "referer": "http://ayszhkmxtffgssgwicyy.supabase.co:2086",
                    "sb_gateway_version": null,
                    "user_agent": "Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)",
                    "x_client_info": null,
                    "x_forwarded_proto": "https",
                    "x_forwarded_user_agent": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null,
                    "x_real_ip": "87.236.176.247"
                  }
                ],
                "host": "ayszhkmxtffgssgwicyy.supabase.co",
                "method": "GET",
                "path": "/",
                "port": null,
                "protocol": "https:",
                "sb": [],
                "search": null,
                "url": "https://ayszhkmxtffgssgwicyy.supabase.co/"
              }
            ],
            "response": [
              {
                "headers": [
                  {
                    "cf_cache_status": null,
                    "cf_ray": null,
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": "application/json;charset=UTF-8",
                    "date": null,
                    "sb_gateway_mode": null,
                    "sb_gateway_version": null,
                    "transfer_encoding": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null
                  }
                ],
                "origin_time": 49,
                "status_code": 401
              }
            ]
          }
        ],
        "timestamp": "2023-05-17T06:09:29.386000"
      },
      {
        "event_message": "GET | 401 | 87.236.176.121 | 7c88c9c659efd0d1 | https://ayszhkmxtffgssgwicyy.supabase.co/ | Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)",
        "metadata": [
          {
            "logflare_worker": [
              {
                "worker_id": "TR781R"
              }
            ],
            "request": [
              {
                "cf": [
                  {
                    "asOrganization": "Constantine Cybersecurity Ltd.",
                    "asn": 211298,
                    "botManagement": [
                      {
                        "corporateProxy": false,
                        "detectionIds": [],
                        "ja3Hash": "7c16ad76eea772e6277cbb0a49d73a5f",
                        "jsDetection": [],
                        "score": 3,
                        "staticResource": false,
                        "verifiedBot": false
                      }
                    ],
                    "city": null,
                    "clientAcceptEncoding": "gzip",
                    "clientTcpRtt": 12,
                    "clientTrustScore": 3,
                    "colo": "AMS",
                    "continent": "EU",
                    "country": "GB",
                    "edgeRequestKeepAliveStatus": 1,
                    "httpProtocol": "HTTP/1.1",
                    "isEUCountry": null,
                    "latitude": "51.49640",
                    "longitude": "-0.12240",
                    "metroCode": null,
                    "postalCode": null,
                    "region": null,
                    "regionCode": null,
                    "requestPriority": null,
                    "timezone": "Europe/London",
                    "tlsCipher": "AEAD-AES128-GCM-SHA256",
                    "tlsClientAuth": [
                      {
                        "certPresented": "0",
                        "certRevoked": "0",
                        "certVerified": "NONE"
                      }
                    ],
                    "tlsExportedAuthenticator": [
                      {
                        "clientFinished": "76e0bce46730af6005f19ee4052a032646e6139a4d4b0257d96224ad0a1ba2d8",
                        "clientHandshake": "3db072c4cf789836b16ac5bdef966ae64e8af9373eac1be7f3d56d1804daede3",
                        "serverFinished": "1934116cc47caee802f33d03416fc3af89e063d3815d0f90cf13f1126f76fe91",
                        "serverHandshake": "c69345105846e60c55c99ddb1458950c14a57d4c942c3838cd3a9bfa158c5d16"
                      }
                    ],
                    "tlsVersion": "TLSv1.3"
                  }
                ],
                "headers": [
                  {
                    "accept": "*/*",
                    "cf_cache_status": null,
                    "cf_connecting_ip": "87.236.176.121",
                    "cf_ipcountry": "GB",
                    "cf_ray": "7c88c9c659efd0d1",
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": null,
                    "date": null,
                    "host": "ayszhkmxtffgssgwicyy.supabase.co",
                    "referer": "http://ayszhkmxtffgssgwicyy.supabase.co:2095",
                    "sb_gateway_version": null,
                    "user_agent": "Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)",
                    "x_client_info": null,
                    "x_forwarded_proto": "https",
                    "x_forwarded_user_agent": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null,
                    "x_real_ip": "87.236.176.121"
                  }
                ],
                "host": "ayszhkmxtffgssgwicyy.supabase.co",
                "method": "GET",
                "path": "/",
                "port": null,
                "protocol": "https:",
                "sb": [],
                "search": null,
                "url": "https://ayszhkmxtffgssgwicyy.supabase.co/"
              }
            ],
            "response": [
              {
                "headers": [
                  {
                    "cf_cache_status": null,
                    "cf_ray": null,
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": "application/json;charset=UTF-8",
                    "date": null,
                    "sb_gateway_mode": null,
                    "sb_gateway_version": null,
                    "transfer_encoding": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null
                  }
                ],
                "origin_time": 35,
                "status_code": 401
              }
            ]
          }
        ],
        "timestamp": "2023-05-17T03:31:33.528000"
      },
      {
        "event_message": "GET | 401 | 87.236.176.78 | 7c8814e07be50bc0 | https://ayszhkmxtffgssgwicyy.supabase.co/ | Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)",
        "metadata": [
          {
            "logflare_worker": [
              {
                "worker_id": "E9VWE9"
              }
            ],
            "request": [
              {
                "cf": [
                  {
                    "asOrganization": "Constantine Cybersecurity Ltd.",
                    "asn": 211298,
                    "botManagement": [
                      {
                        "corporateProxy": false,
                        "detectionIds": [],
                        "ja3Hash": "7c16ad76eea772e6277cbb0a49d73a5f",
                        "jsDetection": [],
                        "score": 3,
                        "staticResource": false,
                        "verifiedBot": false
                      }
                    ],
                    "city": null,
                    "clientAcceptEncoding": "gzip",
                    "clientTcpRtt": 11,
                    "clientTrustScore": 3,
                    "colo": "AMS",
                    "continent": "EU",
                    "country": "GB",
                    "edgeRequestKeepAliveStatus": 1,
                    "httpProtocol": "HTTP/1.1",
                    "isEUCountry": null,
                    "latitude": "51.49640",
                    "longitude": "-0.12240",
                    "metroCode": null,
                    "postalCode": null,
                    "region": null,
                    "regionCode": null,
                    "requestPriority": null,
                    "timezone": "Europe/London",
                    "tlsCipher": "AEAD-AES128-GCM-SHA256",
                    "tlsClientAuth": [
                      {
                        "certPresented": "0",
                        "certRevoked": "0",
                        "certVerified": "NONE"
                      }
                    ],
                    "tlsExportedAuthenticator": [
                      {
                        "clientFinished": "c361f43dba606be544a10f2b77a8a30588eb3a4a78489b114ba8f38d56d1d988",
                        "clientHandshake": "c645ab59732dfacdd00a5b00b60be8c2d5ba439b94a12b2cd19fd35bd8e46b78",
                        "serverFinished": "0c89686c2599fa2d4e9f464833feb0bdcdca954dc094a06f727d39c2c254ff05",
                        "serverHandshake": "ea133357f1ada5ada38a0dfb0923319cdfd4495b29fe0dec87af5c7fc98d842e"
                      }
                    ],
                    "tlsVersion": "TLSv1.3"
                  }
                ],
                "headers": [
                  {
                    "accept": "*/*",
                    "cf_cache_status": null,
                    "cf_connecting_ip": "87.236.176.78",
                    "cf_ipcountry": "GB",
                    "cf_ray": "7c8814e07be50bc0",
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": null,
                    "date": null,
                    "host": "ayszhkmxtffgssgwicyy.supabase.co",
                    "referer": "http://ayszhkmxtffgssgwicyy.supabase.co:2082",
                    "sb_gateway_version": null,
                    "user_agent": "Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)",
                    "x_client_info": null,
                    "x_forwarded_proto": "https",
                    "x_forwarded_user_agent": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null,
                    "x_real_ip": "87.236.176.78"
                  }
                ],
                "host": "ayszhkmxtffgssgwicyy.supabase.co",
                "method": "GET",
                "path": "/",
                "port": null,
                "protocol": "https:",
                "sb": [],
                "search": null,
                "url": "https://ayszhkmxtffgssgwicyy.supabase.co/"
              }
            ],
            "response": [
              {
                "headers": [
                  {
                    "cf_cache_status": null,
                    "cf_ray": null,
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": "application/json;charset=UTF-8",
                    "date": null,
                    "sb_gateway_mode": null,
                    "sb_gateway_version": null,
                    "transfer_encoding": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null
                  }
                ],
                "origin_time": 48,
                "status_code": 401
              }
            ]
          }
        ],
        "timestamp": "2023-05-17T01:28:03.970000"
      },
      {
        "event_message": "GET | 401 | 172.70.13.228 | 7c87f8504f8617e6 | https://ayszhkmxtffgssgwicyy.supabase.co/ | Cloudflare-SSLDetector",
        "metadata": [
          {
            "logflare_worker": [
              {
                "worker_id": "IBISJ2"
              }
            ],
            "request": [
              {
                "cf": [
                  {
                    "asOrganization": "Cloudflare",
                    "asn": 132892,
                    "botManagement": [
                      {
                        "corporateProxy": false,
                        "detectionIds": [],
                        "ja3Hash": "473cd7cb9faa642487833865d516e578",
                        "jsDetection": [],
                        "score": 1,
                        "staticResource": false,
                        "verifiedBot": true
                      }
                    ],
                    "city": "Oceanside",
                    "clientAcceptEncoding": "gzip",
                    "clientTcpRtt": 25,
                    "clientTrustScore": 1,
                    "colo": "SJC",
                    "continent": "NA",
                    "country": "US",
                    "edgeRequestKeepAliveStatus": 1,
                    "httpProtocol": "HTTP/1.1",
                    "isEUCountry": null,
                    "latitude": "33.19220",
                    "longitude": "-117.38520",
                    "metroCode": "825",
                    "postalCode": "92058",
                    "region": "California",
                    "regionCode": "CA",
                    "requestPriority": null,
                    "timezone": "America/Los_Angeles",
                    "tlsCipher": "AEAD-AES128-GCM-SHA256",
                    "tlsClientAuth": [
                      {
                        "certPresented": "0",
                        "certRevoked": "0",
                        "certVerified": "NONE"
                      }
                    ],
                    "tlsExportedAuthenticator": [
                      {
                        "clientFinished": "6c8e1d9e34167c53f42da8b11991086762d1bb2a3bb59934ff87a0585a236ace",
                        "clientHandshake": "f7739acf16c73b1e878ea129668d9dc451da1577410d12633f0f223716c8c322",
                        "serverFinished": "55c1d9e55a2faba5e8f9524da7b2521ca7a9b755ae5e85a29c19ffbd5e1480eb",
                        "serverHandshake": "60e6c82069798804c9cc6106da8358d6f3c7656ee6a579f55bd76e3f1cb33344"
                      }
                    ],
                    "tlsVersion": "TLSv1.3"
                  }
                ],
                "headers": [
                  {
                    "accept": null,
                    "cf_cache_status": null,
                    "cf_connecting_ip": "172.70.13.228",
                    "cf_ipcountry": "US",
                    "cf_ray": "7c87f8504f8617e6",
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": null,
                    "date": null,
                    "host": "ayszhkmxtffgssgwicyy.supabase.co",
                    "referer": null,
                    "sb_gateway_version": null,
                    "user_agent": "Cloudflare-SSLDetector",
                    "x_client_info": null,
                    "x_forwarded_proto": "https",
                    "x_forwarded_user_agent": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null,
                    "x_real_ip": "172.70.13.228"
                  }
                ],
                "host": "ayszhkmxtffgssgwicyy.supabase.co",
                "method": "GET",
                "path": "/",
                "port": null,
                "protocol": "https:",
                "sb": [],
                "search": null,
                "url": "https://ayszhkmxtffgssgwicyy.supabase.co/"
              }
            ],
            "response": [
              {
                "headers": [
                  {
                    "cf_cache_status": null,
                    "cf_ray": null,
                    "content_length": null,
                    "content_location": null,
                    "content_range": null,
                    "content_type": "application/json;charset=UTF-8",
                    "date": null,
                    "sb_gateway_mode": null,
                    "sb_gateway_version": null,
                    "transfer_encoding": null,
                    "x_kong_proxy_latency": null,
                    "x_kong_upstream_latency": null
                  }
                ],
                "origin_time": 100,
                "status_code": 401
              }
            ]
          }
        ],
        "timestamp": "2023-05-17T01:08:34.068000"
      }
    ],
    "error": null
  }
  return res.status(200).json(response)
}
