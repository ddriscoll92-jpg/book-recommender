# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication >> session kicks out second device (session enforcement)
- Location: tests/auth.spec.js:79:7

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: 📚
      - generic [ref=e8]: TeachReads
    - generic [ref=e9]:
      - button "Book Recommender" [active] [ref=e10] [cursor=pointer]
      - button "My Books" [ref=e11] [cursor=pointer]
      - button "My Units" [ref=e12] [cursor=pointer]
      - button "My Resources" [ref=e13] [cursor=pointer]
      - button "My Presentations" [ref=e14] [cursor=pointer]
      - button "AI Assistant" [ref=e15] [cursor=pointer]
    - generic [ref=e17] [cursor=pointer]:
      - generic [ref=e18]: S
      - generic [ref=e19]:
        - generic [ref=e20]: simon
        - generic [ref=e21]: Premium plan
      - generic [ref=e22]: ▼
  - generic [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]: 📚
      - generic [ref=e27]:
        - heading "Book Recommender" [level=1] [ref=e28]
        - paragraph [ref=e29]: Tailored reading suggestions for UK primary school teachers
    - generic [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]: Subject
          - combobox [ref=e34] [cursor=pointer]:
            - option "Select subject..."
            - option "Art"
            - option "Computing"
            - option "DT"
            - option "Geography"
            - option "History"
            - option "Literacy"
            - option "Maths" [selected]
            - option "Music"
            - option "PE"
            - option "PSHE"
            - option "RE"
            - option "Science"
        - generic [ref=e35]:
          - generic [ref=e36]: Topic
          - textbox "e.g. Romans" [ref=e37]
        - generic [ref=e38]:
          - generic [ref=e39]: Year group
          - combobox [ref=e40] [cursor=pointer]:
            - option "Select..." [selected]
            - option "Year 1"
            - option "Year 2"
            - option "Year 3"
            - option "Year 4"
            - option "Year 5"
            - option "Year 6"
      - generic [ref=e41]:
        - generic [ref=e42]: Specific focus — optional
        - textbox "Add any specific aspect of the topic..." [ref=e43]
        - generic [ref=e44]:
          - generic [ref=e45] [cursor=pointer]: ⚡ ⚡ shared reading aloud
          - generic [ref=e46] [cursor=pointer]: ⚡ ⚡ independent reading
          - generic [ref=e47] [cursor=pointer]: ⚡ ⚡ inspires creative writing
          - generic [ref=e48] [cursor=pointer]: ⚡ ⚡ supports SEND learners
          - generic [ref=e49] [cursor=pointer]: ⚡ ⚡ guided reading
          - generic [ref=e50] [cursor=pointer]: ⚡ ⚡ class discussion
          - generic [ref=e51] [cursor=pointer]: ⚡ ⚡ supports EAL learners
      - generic [ref=e53] [cursor=pointer]:
        - generic [ref=e54]:
          - generic [ref=e55]: ⚙️
          - generic [ref=e56]:
            - generic [ref=e57]: Refine results
            - generic [ref=e58]: Filter by type, content and reading level
        - generic [ref=e60]: ▼
    - button "✨ Find books" [ref=e61] [cursor=pointer]
    - generic [ref=e62]: TeachReads · For UK primary school teachers
```