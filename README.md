# Security.txt (RFC 9116) Checker - Browser Extension 🔒

A simple, privacy-friendly browser extension that checks whether a visited website publishes a security.txt (RFC 9116) file - a standard for [vulnerability disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure) and [bug bounty](https://en.wikipedia.org/wiki/Bug_bounty_program) contact information.

## File structure
```
extension/
 ├── manifest.json
 ├── background.js
 ├── popup.html
 └── popup.js
```

## 💬 Motivation

The security.txt standard helps security researchers and companies communicate safely about vulnerabilities.
This extension makes it one click easier to check whether a website has a disclosure policy or bug bounty program.

## Useful resources
- [Security.txt](https://en.wikipedia.org/wiki/Security.txt)
- [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)
- https://securitytxt.org/

----

If you'd like to use this - feel free! If you'd like to modify or build upon it - that's welcome as well.
However, it would be greatly appreciated if you could properly credit `mbiesiad`.

## 🤝 Contributing
Contributions and pull requests are welcome!
If you find a bug or have an idea for improvement, please open an [issue](https://github.com/mbiesiad/security-txt-checker/issues).

## 📜 License

This project is licensed under the MIT License - see [LICENSE](https://github.com/mbiesiad/security-txt-checker/blob/main/LICENSE) for details.

 ## Disclaimer
For educational and defensive purposes only. 
