# Makefile

# Node.js 프로젝트용 테스트 실행
test:
	@echo "==== Running Node.js tests... ===="
	npm install
	npm test || echo "Tests failed."

# 코드 스타일 검사
lint:
	@echo "==== Running ESLint check... ===="
	npx eslint . || echo "Lint check failed."

# 젠킨스에서 전체 CI 프로세스로 쓸 수 있는 타겟
ci: lint test
	@echo "==== CI process completed ===="
# Makefile (Node.js CI)

SHELL := /bin/bash
NPM ?= npm

.PHONY: check-npm ci test lint

check-npm:
	@command -v $(NPM) >/dev/null 2>&1 || { \
	  echo "[ERROR] '$(NPM)' not found in PATH."; exit 127; }

ci: check-npm
	@echo "==== CI: install & test ===="
	$(NPM) ci
	$(NPM) test -- --verbose

test: check-npm
	@echo "==== Running Node.js tests... ===="
	$(NPM) ci
	$(NPM) test

lint: check-npm
	@echo "==== ESLint ===="
	npx eslint . 
