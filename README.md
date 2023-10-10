# Micro Frontends App Angular

### mfes-app-angular

This is the official documentation for the frontoffice monorepo containing Angular Project.

## Table of Contents

- ### Workspace Setup
- ### Code Conventions
- ### NX
- ### Broker Shared
  - #### Common PrimeNG Bugs (and how to solve them)
- ## Broker Portal
- ## Broker Panel

## WorkSpace Setup

- HttpClientModule

## Code Conventions

- proper style encapsulation

## NX

## Broker Shared

This chapter contains information about any shared code between both the Broker Portal and the Broker Panel.

### Known Bugs and fixes

PrimeNG is the UI Component framework that we use for both the Broker Portal and the Broker Panel.  
Even though it is pretty handy, there are a few things that we need to override or customize in order to get it to work
properly. This chapter contains an overview of these issues.

We are currently using PrimeNG version 12, this official documentation can be
found [here](https://www.primefaces.org/primeng/v12-lts/#/).

#### P-Calendar (PrimeNG 12.0.0)

The [p-calendar component](https://www.primefaces.org/primeng/v12-lts/#/calendar) emitted value fails to take the local
timezone into consideration and is prone to return the selected date minus one day.  
Therefor we have to manually convert the selected value for it to be stored correctly.

This can be done with the following conversion:

`new Date(value.getTime() - value.getTimezoneOffset() * 60 * 1000).toISOString()`

Make sure to do a null check before converting the value.

Another known issue is that the p-calendar component cannot handle timestamps that are returned from the server. To fix
this, please make sure to convert the timestamp to a Date object by using the `new Date(value)` constructor whenever a
timestamp is communicated to the component class and consumed by a p-calendar component.

One final comment on the p-calendar component is to make sure to **not** implement the **readOnlyInput** property as
this will disallow the user to enter the date by keyboard. This property defaults to null.

#### Ngx Intl Tel Input (ngx-intl-tel-input 3.2.0)

The `ngx-intl-tel-input component`, which is implemented in the shared `cfo-phone-input` component, does not render the
correct country flag on initial load. As a fix, we have implemented the `setCountryFlag` function in
the `cfo-phone-input` component. This fix overrides the flag's css class when we load the set value, ignoring the
default flag. It is however dependant of the `iti__flag` and `iti__<selected_country>` classnames, so if these are to
change in a newer version then this function should be updated accordingly.

#### Ngx Intl Tel Input (ngx-intl-tel-input 3.2.0)

We also had to override the read-only class in the `ngx-intl-tel-input component`, and this poses the same potential
issues as above. For this functionality to work, we are overriding the `form-control` class.
