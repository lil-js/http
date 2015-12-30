VERSION = 0.1.17
BROWSERIFY = node ./node_modules/browserify/bin/cmd.js
MOCHA = ./node_modules/.bin/mocha
UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = "/*! lil-http - v$(VERSION) - MIT License - https://github.com/lil-js/http */"
MOCHA_PHANTOM = ./node_modules/.bin/mocha-phantomjs

define release
	VERSION=`node -pe "require('./bower.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		var j = require('./bower.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./bower.json', s);" && \
	node -e "\
		var j = require('./component.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./component.json', s);" && \
	git commit -am "release $$NEXT_VERSION" && \
	git tag "$$NEXT_VERSION" -m "Version $$NEXT_VERSION"
endef

default: all
all: test
browser: uglify
test: browser mocha

uglify:
	$(UGLIFYJS) http.js --mangle --preamble $(BANNER) --source-map http.min.js.map --source-map-url http://cdn.rawgit.com/lil-js/http/$(VERSION)/http.min.js.map > http.min.js

mocha:
	bash ./test/run.sh 8888

loc:
	wc -l http.js

gzip:
	gzip -c http.js | wc -c

release:
	@$(call release, patch)

release-minor:
	@$(call release, minor)

publish: browser release
	git push --tags origin HEAD:master
