# Репозиторий «Роском Онлайн»

Основной проект — **`roskom-video-studio/`**: автоматическая видеостудия роликов с маскотом бренда.
Перед работой с видео прочитай `roskom-video-studio/CLAUDE.md` (правила, формат раскадровки, команды).

- «Создай/сделай ролик/видео на тему…» → навык `create-video` (`.claude/skills/create-video/SKILL.md`).
- **Главное правило:** сначала сценарий, показанный пользователю целиком, затем его явное утверждение («Утверждаю», «Согласовано», «Запускай производство»), только потом озвучка, анимация и монтаж. Без статуса APPROVED в `project.json` производство запрещено (CLI откажет сам).
- Агенты студии: `.claude/agents/` (content-planner, researcher, scriptwriter, legal-reviewer, storyboard-director, video-director, quality-reviewer).
- Маркетинговые навыки в `.claude/skills/` (copywriting, social и др.) можно использовать для текстов публикаций.
- Сайт бренда: https://roskom.online/ (файл `сайт`).
