DEST_DIR ?=
ABS_DEST_DIR = $(patsubst ~/%,${HOME}/%,$(DEST_DIR))
WATCH_LATENCY ?= 0.5

.PHONY: check-dest-dir
check-dest-dir:
	@test -n "$(DEST_DIR)" || (echo "DEST_DIR=/path/to/destination を指定してください"; exit 1)
	@test -d "$(ABS_DEST_DIR)" || (echo "DEST_DIR=$(ABS_DEST_DIR) が見つかりません"; exit 1)

.PHONY: check-js
check-js:
	@test -n "$(JS)" || (echo "JS=my_plugins/_private/HTN_MonsterMessage/HTN_MonsterMessage.js のように指定してください"; exit 1)
	@test -f "$(JS)" || (echo "JS=$(JS) が見つかりません"; exit 1)

# my_plugins ディレクトリの _private 以外の JS ファイルをすべて DEST_DIR に置く
.PHONY: sync
sync: check-dest-dir
	find my_plugins -path 'my_plugins/_private' -prune -o -type f -name '*.js' -print0 | rsync -av --from0 --files-from=- --no-relative ./ "$(ABS_DEST_DIR)"

# my_plugins ディレクトリの _private 以外の JS ファイルをすべて DEST_DIR に置き、変更を監視して自動で更新する
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

# 単体の JS ファイルを DEST_DIR に置き、変更を監視して自動で更新する
.PHONY: watch-js
watch-js: check-dest-dir check-js
	copy_js() { \
		rsync -a "$(JS)" "$(ABS_DEST_DIR)/"; \
	}; \
	copy_js; \
	fswatch "$(JS)" | while IFS= read -r event; do \
		sleep "$(WATCH_LATENCY)"; \
		copy_js; \
	done
