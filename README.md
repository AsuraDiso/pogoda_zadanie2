# Docker Build & Push Workflow 

Ten workflow automatyzuje budowanie, skanowanie i wysyłanie obrazu Docker z moją aplikacją do GitHub Container Registry (GHCR). Całość uruchamia się automatycznie, gdy:

- coś wypchnę na gałąź `main`, **lub**
- dodam nowy tag w stylu `v1.0`, `v2.3` itd.

## Co robi ten workflow? (Krok po kroku)

### 1. Checkout + Node.js
- Pobiera kod źródłowy z repo.
- Instaluje zależności Node.js (`npm install`).
- Próbuje automatycznie naprawić problemy (`npm audit fix`).
- Doinstalowuje `cross-spawn`, żeby wszystko działało bez problemów.

### 2. Przygotowanie do builda
- **QEMU** – emulacja pozwala budować obrazy też dla ARM (np. Raspberry Pi).
- **Buildx** – narzędzie Dockera do wieloplatformowego budowania.
- **Logowanie do rejestrów**:
  - DockerHub – tylko do cache’a.
  - GHCR – miejsce, gdzie wrzucam gotowy obraz.

### 3. Skrócony hash SHA
- Generuje skrócony hash (`sha-xxxxxxx`) z aktualnego commita, który potem używam w nazwie taga obrazu.

### 4. Budowanie obrazu
- Buduję obraz dla:
  - `linux/amd64` (normalne komputery)
  - `linux/arm64` (np. ARM, Raspberry Pi)
- Wykorzystuję **cache** z GHCR (szybsze buildy, brak limitów jak w GitHub Cache).
- Wypycham obraz z dwoma tagami:
  - `sha-<skrót>` – jednoznacznie wskazuje na commit,
  - `latest` – zawsze najnowsza wersja.

### 5. Trivy – skan bezpieczeństwa
- Skanuję gotowy obraz pod kątem podatności (HIGH, CRITICAL).
- Jeśli coś jest nie tak – workflow się zatrzymuje i obraz **nie** trafia do rejestru.

---

## Co zyskuję?
- Automatyczne budowanie i publikowanie obrazów Docker.
- Obsługa wielu architektur (działa np. na Raspberry Pi).
- Bezpieczne wypuszczanie wersji – jeśli coś jest nie tak, CI przerywa proces.
- Stały dostęp do najnowszego obrazu (`latest`) + możliwość śledzenia wersji po tagu `sha-xxxxx`.

---

**Technologie użyte:**
- GitHub Actions
- Docker Buildx + QEMU
- Trivy (skan podatności)
- GHCR (GitHub Container Registry)
