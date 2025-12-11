SHELL := /bin/bash

ROUTES_PUBLIC = / /users/login /users/signup /users/find
BASE_URL      = http://localhost:3000

.PHONY: start-server stop-server route-check-local

start-server:
	@echo "==== Starting server for route-check ===="
	npm start & echo $$! > server.pid
	@sleep 5

stop-server:
	@echo "==== Stopping server ===="
	@[ -f server.pid ] && kill `cat server.pid` 2>/dev/null || true
	@rm -f server.pid

route-check-local: start-server
	@echo "==== Route health check (LOCAL) ===="
	@for path in $(ROUTES_PUBLIC); do \
	  echo "→ Checking $(BASE_URL)$$path"; \
	  status=$$(curl -o /dev/null -s -w "%{http_code}" "$(BASE_URL)$$path"); \
	  if [ "$$status" -ge 200 ] && [ "$$status" -lt 400 ]; then \
	    echo "   [OK] $$path (status $$status)"; \
	  else \
	    echo "   [FAIL] $$path (status $$status)"; \
	    $(MAKE) stop-server; \
	    exit 1; \
	  fi; \
	done; \
	$(MAKE) stop-server
	@echo "==== All local routes OK ===="
