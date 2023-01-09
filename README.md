# [Farcaster Directory](https://directory.yashkarthik.xyz)

A directory of Farcaster accounts and their respective Twitter accounts, making it easy find your
Twitter friends on Farcaster.

Head to [directory.yashkarthik.xyz](https://directory.yashkarthik.xyz) to add yourself to the
directory.
## API
Endpoint: `https://directory.yashkarthik.xyz/api/read-users/:fid`

Where FID is the user's Farcaster ID.

Response shape (if no errors):
```
{
  id:                number;
  fid:               number;
  fname:             string;
  twitter_username:  string;
  custody_address:   string;
  connected_address: string[];
  cast_timestamp:    string|null;
  tweet_timestamp:   Date;
  cast_content:      string|null;
  tweet_content:     string|null;
  cast_link:         string|null;
  tweet_link:        string|null;
}[]
```

- Either the cast params (timestamp, content, link) or the tweet params may be null, but not both.
- The `id` has no meaning with repect to the protocol, it's just the database primary key.
- Unique properties? None of the props are unique to a single row. The same FID may be "owned" by
different twitter users, and vice versa. Hence the array response.

- Create an issue if you need other endpoints.

###### Bootstrapped with [create-t3-app](https://create.t3.gg/).
