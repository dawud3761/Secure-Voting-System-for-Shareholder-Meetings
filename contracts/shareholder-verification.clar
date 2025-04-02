;; Shareholder Verification Contract
;; This contract validates voting eligibility based on shareholder status and shares owned

;; Define data variables
(define-data-var admin principal tx-sender)
(define-map shareholders principal uint)
(define-data-var record-date uint u0)
(define-data-var voting-open bool false)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-REGISTERED u101)
(define-constant ERR-NOT-FOUND u102)
(define-constant ERR-VOTING-CLOSED u103)

;; Admin functions
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err ERR-NOT-AUTHORIZED))
    (ok (var-set admin new-admin))))

(define-public (set-record-date (date uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err ERR-NOT-AUTHORIZED))
    (ok (var-set record-date date))))

(define-public (toggle-voting)
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err ERR-NOT-AUTHORIZED))
    (ok (var-set voting-open (not (var-get voting-open))))))

;; Shareholder management
(define-public (register-shareholder (shareholder principal) (shares uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-none (map-get? shareholders shareholder)) (err ERR-ALREADY-REGISTERED))
    (ok (map-set shareholders shareholder shares))))

(define-public (update-shares (shareholder principal) (shares uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? shareholders shareholder)) (err ERR-NOT-FOUND))
    (ok (map-set shareholders shareholder shares))))

(define-public (remove-shareholder (shareholder principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? shareholders shareholder)) (err ERR-NOT-FOUND))
    (ok (map-delete shareholders shareholder))))

;; Read-only functions
(define-read-only (get-shares (shareholder principal))
  (default-to u0 (map-get? shareholders shareholder)))

(define-read-only (is-eligible (shareholder principal))
  (is-some (map-get? shareholders shareholder)))

(define-read-only (is-voting-open)
  (var-get voting-open))

(define-read-only (get-record-date)
  (var-get record-date))

(define-read-only (get-admin)
  (var-get admin))
