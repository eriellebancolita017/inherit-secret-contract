This application use Secret Contract.

Here is the logic.

First the owner write the doc and encrypt it with own password.

Then go to the dapp and store the password with secret contract and whitelist the addresses for guests.
Then set the time elapsed conditions. (blockheight + elapsed block time)
Guest can interact with secret contract and get password through GetPassword function after the elapsed time.
And then guest can access the doc with that password.

e.g. Owner can save his assets information to the doc and encrypt it and then save the password.
Then he sent it to his relatives after setting 10 years.
If we assume that owner passed away 8 years later, then relatives can get password 2 years later and then own his assets information without any third-party.

That's the logic.

Here are more details for this contract.


https://docs.google.com/document/d/16qR7wvh5wOKTKs4sMoWvJSPNt_9UP6_LcW-R5ROFXGw/edit
