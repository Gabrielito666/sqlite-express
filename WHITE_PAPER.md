## White paper

This project began when I was just starting to learn programming. It was nothing more than a couple of functions for inserting or selecting that I copied and pasted into different projects. After a while, I decided to publish it on npm as an object with these functions. As I learned more and more, it became a library of classes that managed queues of operations and incorporated more and more methods.

There have been several versions, and they are not backward compatible, which is normal since this is part of my learning process. However, I see that it has about 30 downloads per week on npm, and it is a package that really makes my other projects much easier. Unfortunately, since I barely knew git when I started, everything is in main.

I am pleased to announce that I am releasing version 6, which comes with new practices to better organize the package. This version is quite stable and has basic testing that gives me some assurance. I have decided to deprecate previous versions and apply future changes in another branch, as it should have always been.

I also decree that the philosophy behind this is to simplify the use of sqlite3 without restricting the user, who should always have full access to their system.