---
title: Developing in the Open
date: 18/04/2017
---

"Hey Ben what have you been working on recently?" is a question that usually
ends in a lengthy answer about new work stuff and how I'm excited for the future
but usually no code links to *show* what I've been <del>playing</del> working
on. Until now at least. This is because the team behind
[bbc.co.uk/programmes](http://www.bbc.co.uk/programmes) is switching to a
"Developing in the Open" mindset for our new projects. This is a process
popularised by
[GDS](https://www.gov.uk/service-manual/technology/making-source-code-open-and-reusable),
[The Guardian](https://www.theguardian.com/info/developer-blog/2014/nov/28/developing-in-the-open),
and [The Financial Times](https://github.com/financial-times).

The BBC has a long tradition of publishing [Open Source](http://www.bbc.co.uk/opensource)
software and has used Developing in the Open for internal-use libraries
such as Sport's [Grandstand](https://github.com/bbc/grandstand) CSS framework,
but I think this might be the first instance of opening up the application code
that is used to directly power BBC systems.

Here's a little primer on what that means and what the team had to go through to
get to this point.


## What is Developing in the Open?

Developing in the Open is having your source code publicly accessible and
licensed and thus available to be seen and used by all. This is very similar to
the traditional model you think of when you hear "Open Source", however there is
a crucial difference. Open Source is for projects that you expect other people
to use and contribute to, while Developing in the Open offers no such
expectation.

As the code we are publicising is specifically for our team's needs, nobody
else would find value in copying the whole thing verbatim and thus wouldn't be
interested in providing patches. Though I'm sure some people will make some
typo fixes in our READMEs so they get marked as having contributed to a BBC
repo. However that doesn't mean we should hide our code away - there is still
value in small portions of the app: a reusable CSS utility, or how to structure
a set of domain models would be useful things that other people can see and
make use of.

It's an inversion of the classical belief that things should be hidden by
default - instead lets make things visible by default and only hide that which
is sensitive. If something isn't worth selling, then why not offer it for free?


## Why Develop in the Open?

The big, selfish reason is a sense of pride. We're working on applications
we're proud of, both in terms of output and how they're put together. We should
be able to show the world what we've made.

Occasionally we come up with something we think is worth sharing, such as
[a CSS utility to deal with image ratios](http://codepen.io/BPScott/pen/NGPMQQ),
[a neat naming convention for grid width classes](http://codepen.io/BPScott/pen/QbXBjo),
or even a [methodology for structuring a design system](https://www.youtube.com/watch?v=qSrM411MD8A)
and having our code be open allows us to show people those things within the
context of our applications, in addition to creating toy demo examples.

It helps improve our code quality. We have to be stricter about following
best practices instead of giving into the temptation of getting sloppy and we'll
feel more compelled to produce higher quality code / commit messages if we know
there's a chance more people shall read what we produce.

The Ministry of Justice recently put out a blog post about
[why they code in the open](https://mojdigital.blog.gov.uk/2017/02/21/why-we-code-in-the-open/)
that covers a couple of other pros.


## Due Diligence

Moving to an open by default model does have some risks. You need to be more
careful about how you handle sensitive data such as passwords, API keys and
information that may give malicious outsiders too much information. Ideally you
should already be mindful about these things - storing secrets in a private
place that is then merged with your public code using
[environment variables](https://12factor.net/config) or some other mechanism as
part of your deployment process.

Ensuring nothing sensitive gets into the repo is an ongoing process and should
anything sensitive be accidentally committed then the secret should be
revoked and changed immediately. Fortunately we are petty good at this already,
our secrets are stored in a separate system - Cosmos - the BBC's
in-house deployment tooling.

As we are opening up projects that have already been in active development we
had to go audit the history of the project to ensure nothing sensitive existed
in the repo.

We found no passwords but we stored our AWS infrastructure configuration -
[CloudFormation templates](https://aws.amazon.com/cloudformation/) and the
[Troposphere](https://github.com/cloudtools/troposphere) config that builds them
as part of the repository. While this information is not instantly recognisable
as
sensitive - it is a template we fill with precise values at a later point - we
decided that there is no value in exposing this information. The
templates are equivalent to a blueprint of a house - any potential bad-actor
would be able to work it out should they get inside, but that doesn't mean we
should tell them the layout up front. This configuration was purged from our git
history using `git filter-branch`, following
[GitHub's guide for removing sensitive data](https://help.github.com/articles/removing-sensitive-data-from-a-repository/).

GDS have wrote a couple of articles about other things to consider when opening
up a code base and when it might not be appropriate:

* [GDS service manual on making code open](https://www.gov.uk/service-manual/technology/making-source-code-open-and-reusable)
* [When is it ok not to open all source code?](https://gds.blog.gov.uk/2014/10/08/when-is-it-ok-not-to-open-all-source-code/)
* [Working out how to open up the Register to Vote code](https://gdstechnology.blog.gov.uk/2016/01/26/working-out-how-to-open-up-the-register-to-vote-code/)


## Licensing

By default a person (or team) retains the rights to their own work and thus
nobody else may used that work. You need to explicitly include a
LICENSE file in your repository to loosen or change those rights if you want
other people to be able to use your work without fear of repercussion.
[choosealicence.com](https://choosealicense.com/) provides a list of licenses
suitable for open-source that allows other people to use your work, roughly
ranked in order of restrictiveness.

For the my team's projects we wanted to allow anybody to be able to use our
code in any project. We don't want a viral copyleft license like
[AGPL](https://choosealicense.com/licenses/agpl-3.0/) that enforces any project
that takes code from our repo to also be openly licensed under the same terms.
Making a project have to change its license if they wish to use a neat CSS
pattern we created is unreasonably heavy handed.

We also want to retain the rights to any patentable work. Software patents are
idiotic, but by us asserting that we own the right to patent anything we
produce, we stop somebody else taking our work and patenting
it (and profiting off it) themselves.

The license we chose is the
[Apache 2.0 License](https://choosealicense.com/licenses/apache-2.0/). This
offers us patent protection, which its nearest sibling the
[MIT License](https://choosealicense.com/licenses/mit/) does not - this is
pretty much the only difference between the two. It also does not enforce a
license on any projects that use any of our code. This is the "standard" license
that be BBC uses for its open-source works and also what the
[Guardian](https://github.com/guardian/frontend) uses for its webapp code.


## Conclusion

A list of our public repositories can be found on GitHub, tagged with
[bbc&#8209;programmes](https://github.com/search?q=topic%3Abbc-programmes+org%3Abbc&type=Repositories).
Of particular note right now are:

* [programmes-pages-service](https://github.com/bbc/programmes-pages-service) -
  A PHP library containing our Database schema, domain models and tools
  to request data from our Database. Our new model layer.
* [programmes-clifton](https://github.com/bbc/programmes-clifton) - A JSON API
  powered by Symfony 3, using programmes-pages-service. It is a drop-in
  replacement for a legacy API, so we can continue to produce pages using the
  the existing [www.bbc.co.uk/programmes](http://www.bbc.co.uk/programmes)
  frontend while we work on its replacement.
* [programmes-frontend](https://github.com/bbc/programmes-frontend) - The new
  Symfony 3 powered web app that shall eventually power
  [www.bbc.co.uk/programmes](http://www.bbc.co.uk/programmes). This is very,
  very work-in-progress right now and we're still working out how it'll all
  fit together.
