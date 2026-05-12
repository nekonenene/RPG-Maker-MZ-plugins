DEST_DIR ?=
ABS_DEST_DIR = $(patsubst ~/%,${HOME}/%,$(DEST_DIR))
WATCH_LATENCY ?= 0.5

.PHONY: check-dest-dir
check-dest-dir:
	@test -n "$(DEST_DIR)" || (echo "DEST_DIR=/path/to/destination を指定してください"; exit 1)

.PHONY: sync
sync: check-dest-dir
	find my_plugins -path 'my_plugins/_private' -prune -o -type f -name '*.js' -print0 | rsync -av --from0 --files-from=- --no-relative ./ "$(ABS_DEST_DIR)"

.PHONY: watch
watch: check-dest-dir
	sync_js() { \
		find my_plugins -path 'my_plugins/_private' -prune -o -type f -name '*.js' -print0 | rsync -a --from0 --files-from=- --no-relative ./ "$(ABS_DEST_DIR)"; \
	}; \
	sync_js; \
	fswatch my_plugins | while IFS= read -r event; do \
		sleep "$(WATCH_LATENCY)"; \
		sync_js; \
	done
