SHELL := /bin/bash
NPM ?= npm

.PHONY: check-npm ci test lint route-check

check-npm:
	@command -v $(NPM) >/dev/null 2>&1 || { \
	  echo "[ERROR] '$(NPM)' not found in PATH."; exit 127; }

#라우트 검사(퍼블릭 대상)
ROUTES_PUBLIC = / /users/login /users/signup /users/find

route-check:
	@echo "==== Route health check ===="
	@for path in $(ROUTES_PUBLIC); do \
	  echo "→ Checking http://localhost:3000$$path"; \
	  status=$$(curl -o /dev/null -s -w "%{http_code}" "http://localhost:3000$$path"); \
	  if [ "$$status" -ge 200 ] && [ "$$status" -lt 400 ]; then \
	    echo "   [OK] $$path (status $$status)"; \
	  else \
	    echo "   [FAIL] $$path (status $$status)"; \
	    exit 1; \
	  fi; \
	done
	@echo "==== All public routes OK ===="

ci: check-npm lint test route-check
	@echo "==== CI process completed ===="

test: check-npm
	@echo "==== Running Node.js tests... ===="
	$(NPM) ci
	$(NPM) test

lint: check-npm
	@echo "==== ESLint ===="
	npx eslint .