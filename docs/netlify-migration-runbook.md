# PortdayGuide Netlify migration runbook

This runbook moves hosting without changing the public site identity. The canonical origin remains `https://portdayguide.com`; URL paths, content, structured data, and indexing directives must remain stable.

## 1. Repository baseline

- [x] Preserve the final ChatGPT Sites release as annotated tag `sites-final-v53`.
- [x] Make runtime changes only on `migration/netlify`.
- [x] Convert Vinext/Cloudflare Worker scripts to standard Next.js commands.
- [x] Add Netlify configuration, environment-variable documentation, and CI.
- [x] Pass the production build, lint, and complete HTTP regression suite.
- [ ] Push the baseline, tag, and migration branch to `kevinchan246/portdayguide`.
- [ ] Open and review a pull request from `migration/netlify` to `main`.

Do not force-push over an existing remote branch. Compare the remote repository before the first push.

## 2. Create the Netlify preview

1. In Netlify, choose **Add new project → Import an existing project → GitHub**.
2. Select `kevinchan246/portdayguide` and deploy `migration/netlify` first.
3. Keep the base directory and publish directory empty.
4. Confirm the build command is `npm run build`. Node `22.13.0` and skew protection come from `netlify.toml`.
5. Do not add `@netlify/plugin-nextjs`; Netlify installs and updates its OpenNext adapter automatically.

## 3. Configure environment variables

Add these under **Project configuration → Environment variables**:

| Key | Value / handling | Deploy contexts |
| --- | --- | --- |
| `VIATOR_API_KEY` | Copy the current Viator Partner API key manually and mark it as secret. | Production and deploy previews that need live cards |
| `VIATOR_API_ROOT` | `https://api.viator.com/partner` | All |
| `NEXT_PUBLIC_VIATOR_AFFILIATE_SUFFIX` | Copy the current public affiliate suffix if one is configured; otherwise omit it. | All |

Never copy a masked secret from logs and never commit a real key to `.env.example`.

## 4. Preview parity gate

Use the Netlify deploy-preview URL without opening the production domain. Complete all items before merging:

- [ ] Netlify deploy and Functions are healthy.
- [ ] `/`, `/ports`, `/blog`, `/planner`, and representative guides return 200.
- [ ] `/api/weather` and `/api/port-image` return valid JSON.
- [ ] `/api/viator/products` returns live products after the key is configured.
- [ ] `sitemap.xml` contains only canonical `https://portdayguide.com` URLs.
- [ ] Every sitemap page has `index, follow`, no `X-Robots-Tag: noindex`, and a self-referencing production canonical.
- [ ] `/privacy`, `/terms`, and `/share` retain their intentional noindex behavior.
- [ ] `www.portdayguide.com/<path>?query` redirects once to the matching apex URL.
- [ ] `/ports/george-town-grand-cayman?source=old` returns 308 to `/ports/grand-cayman?source=old`.
- [ ] Static images, fonts, CSS, JavaScript, maps, and affiliate cards load without 4xx/5xx responses.
- [ ] Article headings, body copy, FAQ, credits, schema, and related-guide links match the Sites baseline.
- [ ] Mobile and desktop layouts have no visible regression.

The automated regression suite covers the content/SEO portion locally and in GitHub Actions. The Netlify preview still needs platform-level API and asset checks.

## 5. Production cutover

1. Merge the reviewed migration pull request to `main` and let Netlify build it.
2. Verify the resulting production deploy on its Netlify URL.
3. Add `portdayguide.com` as the primary production domain and `www.portdayguide.com` as an alias in Netlify.
4. Use the exact DNS records shown by Netlify for the selected DNS setup. Do not guess or hard-code an IP.
5. If DNS is hosted elsewhere, reduce TTL at least one TTL window before cutover when practical.
6. Change only the required apex and `www` records. Do not change email or unrelated DNS records.
7. Wait for Netlify TLS provisioning, then verify both HTTPS hostnames and the single-hop `www` redirect.
8. Keep the previous ChatGPT Sites deployment intact during the observation period.

## 6. Post-cutover SEO verification

Within the first hour:

- [ ] Confirm 200 status and correct canonical on the home page, port hub, blog hub, one port guide, one topic guide, and one pillar/sub-page pair.
- [ ] Confirm `robots.txt`, `sitemap.xml`, security headers, and 308 redirects.
- [ ] Confirm no new trailing-slash or case redirects were introduced.
- [ ] Confirm server-side Viator cards work without exposing the API key in HTML or browser JavaScript.
- [ ] Inspect Netlify Functions logs for repeated 4xx/5xx errors.

Within 24 hours:

- [ ] Submit or re-submit `https://portdayguide.com/sitemap.xml` in Google Search Console.
- [ ] Use URL Inspection on the home page and representative cluster pages.
- [ ] Check Page indexing, HTTPS, Core Web Vitals, and crawl anomalies.
- [ ] Re-run the external site audit and compare broken links, images, canonicals, redirects, and noindex counts with the baseline.

Do not change canonical URLs to the Netlify subdomain and do not submit the Netlify subdomain to Search Console.

## 7. Rollback

Rollback if the apex domain has sustained 5xx errors, key public routes fail, canonical/indexing directives change, or live affiliate/API behavior cannot be restored promptly.

1. Revert the apex and `www` DNS records to the recorded pre-cutover values.
2. Restore the previous host as the serving origin; the Sites baseline is tagged `sites-final-v53`.
3. Purge or retry only after DNS/TLS has stabilized.
4. Document the failing Netlify deploy and fix it on a branch before attempting cutover again.

Keep the previous host available for at least 14 days after a healthy cutover. DNS rollback speed depends on TTL and resolver caches, so rollback is not instantaneous.
